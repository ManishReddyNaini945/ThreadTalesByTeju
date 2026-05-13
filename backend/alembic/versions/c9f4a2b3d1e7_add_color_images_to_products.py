"""add color_images to products

Revision ID: c9f4a2b3d1e7
Revises: b7d3e2f1a4c5
Create Date: 2026-05-12 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c9f4a2b3d1e7'
down_revision: Union[str, None] = 'b7d3e2f1a4c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('color_images', sa.JSON(), nullable=True, server_default='{}'))


def downgrade() -> None:
    op.drop_column('products', 'color_images')
