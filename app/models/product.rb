class Product < ApplicationRecord
  monetize :price_cents, as: :price

  has_many :cart_items
  validates_presence_of :name, :quantity
  validates_numericality_of :quantity, :price_cents, greater_than_or_equal_to: 0

  def remaining
    quantity - cart_items.map(&:quantity).reduce(0) { |a, b| a + b }
  end

  def as_json(args = {})
    super(args.merge(methods: [:remaining]))
  end
end
