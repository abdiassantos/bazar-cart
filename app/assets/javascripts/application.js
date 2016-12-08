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
//= require material
//= require_tree .

$(document).on("turbolinks:load", function() {
  componentHandler.upgradeDom();

  $("#product_price").mask('#.##0.00', {reverse: true});
  $("#cart-owner").autocomplete({
    serviceUrl: "/carts/owners",
    triggerSelectOnValidInput: false,
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
    onSelect: addProductToCart
  });

  bindCartItems();
  createProductInline();

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
    $("[name=paymentMethod], #installments, [name=provider]").change(paymentMethodChanged);
    paymentMethodChanged();

    function paymentMethodChanged() {
      $(".installments").toggle(paymentMethod() === "creditCard");
      $(".credit-card-provider").toggle(paymentMethod() === "creditCard");
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
        case "creditCard": return correctPrice(cents, creditCardRate());
      }
    }

    function paymentMethod() {
      return $("[name=paymentMethod]:checked").val();
    }

    function creditCardRate() {
      var provider = $('[name=provider]:checked').val();
      switch (provider) {
        case "payleven":
          return 0.0419 + installments() * 0.0249;
        case "picpay":
          return picpayRate();
        default: throw new Error("Unrecognized credit card provider: " + provider);
      }
    }

    function picpayRate() {
      switch (installments()) {
        case "0": return 4.89 / 100;
        case "1": return 5.49 / 100;
        case "2": return 6.99 / 100;
        case "3": return 7.99 / 100;
        case "4": return 9.49 / 100;
        case "5": return 10.99 / 100;
        case "6": return 11.98 / 100;
        case "7": return 12.98 / 100;
        case "8": return 14.49 / 100;
        case "9": return 15.49 / 100;
        case "10": return 16.29 / 100;
        case "11": return 16.98 / 100;
      }
    }

    function installments() {
      return $("#installments").val();
    }

    function correctPrice(cents, taxes) {
      return cents / (1 - taxes);
    }
  }

  function addProductToCart({ data: product }) {
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

  function createProductInline() {
    var $dialog = $('#create-product-dialog');

    if (!$dialog.length) { return; }
    var dialog = $dialog[0];

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    $('#add-product').click(() => dialog.showModal());
    var form = $dialog.find('#new_product');
    form.submit(event => {
      event.preventDefault();
      $.ajax({
        url: "/products.json",
        type: "POST",
        data: form.serialize(),
        success: product => {
          addProductToCart({ data: product });
          dialog.close();
          form[0].reset();
          form.find('input[type=submit]').prop('disabled', false);
        }
      });
    });
  }
});
