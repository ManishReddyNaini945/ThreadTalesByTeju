"""add is_new_arrival to products

Revision ID: m1b4c5d6e7f8
Revises: l0a3b4c5d6e7
Create Date: 2026-07-19
"""
from alembic import op
import sqlalchemy as sa

revision = 'm1b4c5d6e7f8'
down_revision = 'l0a3b4c5d6e7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('products', sa.Column('is_new_arrival', sa.Boolean(), nullable=True, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column('products', 'is_new_arrival')
