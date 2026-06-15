"""add payment_reminder_sent_at to orders

Revision ID: l0a3b4c5d6e7
Revises: k9f2a3b4c5d6
Create Date: 2026-06-15
"""
from alembic import op
import sqlalchemy as sa

revision = 'l0a3b4c5d6e7'
down_revision = 'k9f2a3b4c5d6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('orders', sa.Column('payment_reminder_sent_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('orders', 'payment_reminder_sent_at')
