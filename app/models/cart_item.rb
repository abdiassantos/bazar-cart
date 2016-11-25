class CartItem < ApplicationRecord
  belongs_to :product
  belongs_to :cart
  default_scope { order(created_at: :desc) }

  validate :has_stock

  private

    def has_stock
      before, after = changes[:quantity]
      difference = if before
                     after - before
                   else
                     quantity
                   end
      if product.remaining - difference < 0
        errors.add(:quantity, "Não há items o suficiente")
      end
    end
end
