"""add site_settings table

Revision ID: i7d0f1a2b3c4
Revises: h6c9e8f0a4d3
Create Date: 2025-06-06
"""
from alembic import op
import sqlalchemy as sa

revision = 'i7d0f1a2b3c4'
down_revision = 'h6c9e8f0a4d3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS site_settings (
            id SERIAL NOT NULL,
            key VARCHAR(100) NOT NULL,
            value TEXT,
            description VARCHAR(255),
            PRIMARY KEY (id)
        )
    """)
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS ix_site_settings_key ON site_settings (key)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_site_settings_id ON site_settings (id)")

    # Seed defaults only if not already present
    op.execute("""
        INSERT INTO site_settings (key, value, description)
        VALUES
            ('promo_enabled',      'true',                    'Promo active toggle'),
            ('promo_threshold',    '999',                     'Min order amount for promo (₹)'),
            ('promo_discount_pct', '15',                      'Discount percentage'),
            ('promo_label',        '15% OFF + FREE SHIPPING', 'Banner display text')
        ON CONFLICT (key) DO NOTHING
    """)


def downgrade() -> None:
    op.drop_index('ix_site_settings_key', table_name='site_settings')
    op.drop_index('ix_site_settings_id',  table_name='site_settings')
    op.drop_table('site_settings')
