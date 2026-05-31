"""add color_names to products

Revision ID: e3f6b4c5d7a9
Revises: d2e5f3a4b6c8
Create Date: 2026-05-13 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'e3f6b4c5d7a9'
down_revision: Union[str, None] = 'd2e5f3a4b6c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('color_names', sa.JSON(), nullable=True, server_default='{}'))


def downgrade() -> None:
    op.drop_column('products', 'color_names')
