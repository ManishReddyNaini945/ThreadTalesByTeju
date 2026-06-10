"""add abandoned_email_sent_at to carts

Revision ID: j8e1f2a3b4c5
Revises: i7d0f1a2b3c4
Create Date: 2026-06-10
"""
from alembic import op
import sqlalchemy as sa

revision = 'j8e1f2a3b4c5'
down_revision = 'i7d0f1a2b3c4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('carts', sa.Column('abandoned_email_sent_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    op.drop_column('carts', 'abandoned_email_sent_at')
