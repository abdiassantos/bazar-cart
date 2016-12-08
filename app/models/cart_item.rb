class CartItem < ApplicationRecord
  belongs_to :product
  belongs_to :cart
  default_scope { order(created_at: :desc) }

  validate :has_stock

  def price
    product.price * quantity
  end

  private

    def has_stock
      before, after = changes[:quantity]
      difference = if before
                     after - before
                   elsif after
                     quantity
                   else
                     0
                   end
      if product.remaining - difference < 0
        errors.add(:quantity, "Não há quantidade o suficiente para #{product.name}")
      end
    end
end
