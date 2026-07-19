"""add starts_at to coupons

Revision ID: n2c5d6e7f8a9
Revises: m1b4c5d6e7f8
Create Date: 2026-07-19
"""
from alembic import op
import sqlalchemy as sa

revision = 'n2c5d6e7f8a9'
down_revision = 'm1b4c5d6e7f8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('coupons', sa.Column('starts_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('coupons', 'starts_at')
