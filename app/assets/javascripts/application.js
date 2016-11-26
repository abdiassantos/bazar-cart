// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(document).on("turbolinks:load", function() {
  $("#product_price").mask('#.##0.00', {reverse: true});
  $("#cart-owner").autocomplete({
    serviceUrl: "/carts/owners",
    onSelect: function(selected) {
      $(this.form).submit();
    }
  });

  var cartForm = $(".edit_cart");

  if (cartForm.length) {
    var parts = cartForm.attr("action").split("/");
    var cartId = parts[parts.length - 1];
  }
  $("#product").autocomplete({
    serviceUrl: "/products.json",
    transformResult: function(result) {
      result = JSON.parse(result);
      return {
        suggestions: result.map(product => ({
          value: `${product.name} (${product.remaining}/${product.quantity})`,
          data: product
        }))
      };
    },
    onSelect: function({ data: product }) {
      $.post("/cart_items", {
        cart_item: {
          cart_id: cartId,
          product_id: product.id,
        }
      }).then(res => {
          $("#cart-items").replaceWith(res.html);
          $(this).val("");
          bindCartItems();
        },
        error => {
          $(this).val("");
          alert(error.responseText);
        }
      );
    }
  });

  bindCartItems();

  function bindCartItems() {
    $("#cart-items .destroy-cart-item").click(function() {
      if (confirm("Tem certeza que deseja deletar esse item?")) {
        $(this)
          .siblings("input.destroy").val(true)
          .parents("tr").addClass("hidden");
        calculatePrices();
      }
    });

    $(".quantity").change(calculatePrices);
    $("[name=paymentMethod], #installments").change(paymentMethodChanged);
    paymentMethodChanged();

    function paymentMethodChanged() {
      $(".installments").toggle(paymentMethod() === "creditCard");
      calculatePrices();
    }

    function calculateCartItemPriceCents(input) {
      var quantity = parseInt(input.val());
      var priceCents = input.parents("tr").find("[data-product-price-cents]").data("product-price-cents");

      return quantity * priceCents;
    }

    function formatPrice(cents) {
      return `R$${(cents / 100.0).toFixed(2)}`;
    }

    function calculatePrices() {
      var total = 0;

      $("#cart-items tr:not(.hidden) .quantity").each((_, input) => {
        input = $(input);
        var price = calculateCartItemPriceCents(input);
        input.parents("tr").find(".cart-item-price").text(formatPrice(price));

        total += price;
      });

      $("#cart-items .cart-total").text(formatPrice(taxes(total)));
    }

    function taxes(cents) {
      switch (paymentMethod()) {
        case "cash": return cents;
        case "debitCard": return correctPrice(cents, 0.0249);
        case "creditCard": return correctPrice(cents, 0.0419 + installments() * 0.0249);
      }
    }

    function paymentMethod() {
      return $("[name=paymentMethod]:checked").val();
    }

    function installments() {
      return $("#installments").val();
    }

    function correctPrice(cents, taxes) {
      return cents / (1 - taxes);
    }
  }
});
