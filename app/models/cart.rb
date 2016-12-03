class Cart < ApplicationRecord
  has_many :cart_items, dependent: :destroy
  validates :owner, presence: true, uniqueness: true
  accepts_nested_attributes_for :cart_items, allow_destroy: true

  def total
    cart_items.map(&:price).sum.to_money
  end
end
