"""add image_types to products

Revision ID: f4a7c6d8e2b1
Revises: e3f6b4c5d7a9
Create Date: 2026-05-13 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'f4a7c6d8e2b1'
down_revision: Union[str, None] = 'e3f6b4c5d7a9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('image_types', sa.JSON(), nullable=True, server_default='{}'))


def downgrade() -> None:
    op.drop_column('products', 'image_types')
