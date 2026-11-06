"""add reference_image_url to cart and order items

Revision ID: t8c1d2e3f4a5
Revises: s7b0c1d2e3f4
Create Date: 2026-11-06
"""
from alembic import op
import sqlalchemy as sa

revision = 't8c1d2e3f4a5'
down_revision = 's7b0c1d2e3f4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('cart_items', sa.Column('reference_image_url', sa.String(500), nullable=True))
    op.add_column('order_items', sa.Column('reference_image_url', sa.String(500), nullable=True))


def downgrade() -> None:
    op.drop_column('order_items', 'reference_image_url')
    op.drop_column('cart_items', 'reference_image_url')
