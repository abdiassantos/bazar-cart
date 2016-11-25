class Cart < ApplicationRecord
  has_many :cart_items
  validates :owner, presence: true, uniqueness: true
  accepts_nested_attributes_for :cart_items, allow_destroy: true
end
