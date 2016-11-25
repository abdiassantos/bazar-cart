class AddDefaultToQuantityFromCartItems < ActiveRecord::Migration[5.0]
  def change
    change_column :cart_items, :quantity, :integer, default: 1
  end
end
