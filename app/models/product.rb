class Product < ApplicationRecord
  monetize :price_cents

  has_many :cart_items
  validates_presence_of :name, :quantity
  validates_numericality_of :quantity, :price_cents, greater_than_or_equal_to: 0
end
