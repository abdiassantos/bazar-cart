class Cart < ApplicationRecord
  has_many :cart_items
  validates :owner, presence: true, uniqueness: true
end
