"""add custom_note to cart_items

Revision ID: h6c9e8f0a4d3
Revises: g5b8d7e9f3c2
Create Date: 2026-05-31

"""
from alembic import op
import sqlalchemy as sa

revision = 'h6c9e8f0a4d3'
down_revision = 'g5b8d7e9f3c2'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('cart_items', sa.Column('custom_note', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('cart_items', 'custom_note')
