"""add reset_token to users

Revision ID: a3f2c1d4e5b6
Revises: e1769c1f01ea
Create Date: 2026-05-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3f2c1d4e5b6'
down_revision: Union[str, None] = 'e1769c1f01ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('reset_token', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('reset_token_expires', sa.DateTime(), nullable=True))
    op.create_unique_constraint('uq_users_reset_token', 'users', ['reset_token'])


def downgrade() -> None:
    op.drop_constraint('uq_users_reset_token', 'users', type_='unique')
    op.drop_column('users', 'reset_token_expires')
    op.drop_column('users', 'reset_token')
