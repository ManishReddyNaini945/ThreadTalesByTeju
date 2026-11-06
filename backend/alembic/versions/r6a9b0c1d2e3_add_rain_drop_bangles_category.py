"""add Rain Drop Bangles category

Revision ID: r6a9b0c1d2e3
Revises: q5f8a9b0c1d2
Create Date: 2026-11-06
"""
from alembic import op

revision = 'r6a9b0c1d2e3'
down_revision = 'q5f8a9b0c1d2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # sort_order -1 puts it ahead of the other collections on the homepage
    op.execute("""
        INSERT INTO categories (name, slug, description, is_active, sort_order)
        SELECT 'Rain Drop Bangles', 'rain-drop-bangles',
               'Vibrant handcrafted glass bangles with a lustrous shine that catches the light with every move — made to stack, gift and celebrate.',
               true, -1
        WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'rain-drop-bangles')
    """)


def downgrade() -> None:
    op.execute("DELETE FROM categories WHERE slug = 'rain-drop-bangles'")
