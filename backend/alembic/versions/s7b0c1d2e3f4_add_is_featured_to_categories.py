"""add is_featured to categories

Revision ID: s7b0c1d2e3f4
Revises: r6a9b0c1d2e3
Create Date: 2026-11-06
"""
from alembic import op
import sqlalchemy as sa

revision = 's7b0c1d2e3f4'
down_revision = 'r6a9b0c1d2e3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('categories', sa.Column('is_featured', sa.Boolean(), nullable=False, server_default=sa.false()))
    # Keep the collection that was highlighted by slug (before or after its rename) featured
    op.execute("UPDATE categories SET is_featured = true WHERE slug IN ('rain-drop-bangles', 'glass-bangles')")


def downgrade() -> None:
    op.drop_column('categories', 'is_featured')
