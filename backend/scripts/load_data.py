# backend/scripts/load_data.py
import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime
# load_data.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.models import DistributionCenter, Product, InventoryItem, User, Order, OrderItem , Base
from db import engine, SessionLocal


Base.metadata.create_all(bind=engine)
session: Session = SessionLocal()

def parse_date(date_str):
    try:
        return pd.to_datetime(date_str) if pd.notna(date_str) else None
    except:
        return None

def load_csv_data():
    # Load Distribution Centers
    dc_df = pd.read_csv('backend/data/distribution_centers.csv')
    for _, row in dc_df.iterrows():
        session.add(DistributionCenter(**row.to_dict()))

    # Load Products
    products_df = pd.read_csv('backend/data/products.csv')
    for _, row in products_df.iterrows():
        session.add(Product(**row.to_dict()))

    # Load Inventory Items
    inventory_df = pd.read_csv('backend/data/inventory_items.csv')
    for _, row in inventory_df.iterrows():
        session.add(InventoryItem(
            id=row['id'],
            product_id=row['product_id'],
            created_at=parse_date(row['created_at']),
            sold_at=parse_date(row['sold_at']),
            cost=row['cost'],
            product_category=row['product_category'],
            product_name=row['product_name'],
            product_brand=row['product_brand'],
            product_retail_price=row['product_retail_price'],
            product_department=row['product_department'],
            product_sku=row['product_sku'],
            product_distribution_center_id=row['product_distribution_center_id']
        ))

    # Load Users
    users_df = pd.read_csv('backend/data/users.csv')
    for _, row in users_df.iterrows():
        session.add(User(
            **{k: row[k] for k in User.__table__.columns.keys() if k in row},
            created_at=parse_date(row['created_at'])
        ))

    # Load Orders
    orders_df = pd.read_csv('backend/data/orders.csv')
    for _, row in orders_df.iterrows():
        session.add(Order(
            order_id=row['order_id'],
            user_id=row['user_id'],
            status=row['status'],
            gender=row['gender'],
            created_at=parse_date(row['created_at']),
            returned_at=parse_date(row['returned_at']),
            shipped_at=parse_date(row['shipped_at']),
            delivered_at=parse_date(row['delivered_at']),
            num_of_item=row['num_of_item']
        ))

    # Load Order Items
    order_items_df = pd.read_csv('backend/data/order_items.csv')
    for _, row in order_items_df.iterrows():
        session.add(OrderItem(
            id=row['id'],
            order_id=row['order_id'],
            user_id=row['user_id'],
            product_id=row['product_id'],
            inventory_item_id=row['inventory_item_id'],
            status=row['status'],
            created_at=parse_date(row['created_at']),
            shipped_at=parse_date(row['shipped_at']),
            delivered_at=parse_date(row['delivered_at']),
            returned_at=parse_date(row['returned_at']),
        ))

    session.commit()
    print("✅ All CSV data loaded successfully!")

if __name__ == '__main__':
    load_csv_data()
