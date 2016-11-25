class CreateCarts < ActiveRecord::Migration[5.0]
  def change
    create_table :carts do |t|
      t.string :owner

      t.timestamps
    end

    add_index :carts, :owner, unique: true
  end
end
