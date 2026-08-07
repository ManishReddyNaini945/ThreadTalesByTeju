"""add custom_note to order_items

Revision ID: q5f8a9b0c1d2
Revises: p4e7f8a9b0c1
Create Date: 2026-08-08
"""
from alembic import op
import sqlalchemy as sa

revision = 'q5f8a9b0c1d2'
down_revision = 'p4e7f8a9b0c1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('order_items', sa.Column('custom_note', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('order_items', 'custom_note')
