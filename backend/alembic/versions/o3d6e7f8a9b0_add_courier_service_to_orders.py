"""add courier_service to orders

Revision ID: o3d6e7f8a9b0
Revises: n2c5d6e7f8a9
Create Date: 2026-07-31
"""
from alembic import op
import sqlalchemy as sa

revision = 'o3d6e7f8a9b0'
down_revision = 'n2c5d6e7f8a9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('orders', sa.Column('courier_service', sa.String(length=50), nullable=True))


def downgrade() -> None:
    op.drop_column('orders', 'courier_service')
