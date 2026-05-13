"""add color_prices to products

Revision ID: d2e5f3a4b6c8
Revises: c9f4a2b3d1e7
Create Date: 2026-05-12 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd2e5f3a4b6c8'
down_revision: Union[str, None] = 'c9f4a2b3d1e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('color_prices', sa.JSON(), nullable=True, server_default='{}'))


def downgrade() -> None:
    op.drop_column('products', 'color_prices')
