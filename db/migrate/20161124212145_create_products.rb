class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name
      t.integer :quantity
      t.monetize :price
      t.string :keywords

      t.timestamps
    end
  end
end
