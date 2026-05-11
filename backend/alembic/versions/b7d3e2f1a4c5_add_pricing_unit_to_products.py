"""add pricing_unit to products

Revision ID: b7d3e2f1a4c5
Revises: a3f2c1d4e5b6
Create Date: 2026-05-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b7d3e2f1a4c5'
down_revision: Union[str, None] = 'a3f2c1d4e5b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('pricing_unit', sa.String(length=20), nullable=False, server_default='piece'))


def downgrade() -> None:
    op.drop_column('products', 'pricing_unit')
