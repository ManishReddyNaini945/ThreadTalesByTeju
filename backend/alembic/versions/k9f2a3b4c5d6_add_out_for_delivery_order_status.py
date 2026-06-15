"""add out_for_delivery to orderstatus enum

Revision ID: k9f2a3b4c5d6
Revises: j8e1f2a3b4c5
Create Date: 2026-06-15
"""
from alembic import op

revision = 'k9f2a3b4c5d6'
down_revision = 'j8e1f2a3b4c5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE orderstatus ADD VALUE IF NOT EXISTS 'out_for_delivery' AFTER 'shipped'")


def downgrade() -> None:
    # Postgres does not support removing enum values; no-op.
    pass
