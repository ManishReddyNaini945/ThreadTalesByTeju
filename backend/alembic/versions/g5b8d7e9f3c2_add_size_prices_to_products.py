"""add size_prices to products

Revision ID: g5b8d7e9f3c2
Revises: f4a7c6d8e2b1
Create Date: 2026-05-29

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON

revision = 'g5b8d7e9f3c2'
down_revision = 'f4a7c6d8e2b1'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('products', sa.Column('size_prices', JSON(), nullable=True))


def downgrade():
    op.drop_column('products', 'size_prices')
