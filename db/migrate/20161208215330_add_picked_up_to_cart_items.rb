class AddPickedUpToCartItems < ActiveRecord::Migration[5.0]
  def change
    add_column :cart_items, :picked_up, :boolean
  end
end
