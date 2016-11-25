class CartItem < ApplicationRecord
  belongs_to :product
  belongs_to :cart
  default_scope { order(created_at: :desc) }
end
