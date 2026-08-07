"""add product_comments table

Revision ID: p4e7f8a9b0c1
Revises: o3d6e7f8a9b0
Create Date: 2026-08-08
"""
from alembic import op
import sqlalchemy as sa

revision = 'p4e7f8a9b0c1'
down_revision = 'o3d6e7f8a9b0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'product_comments',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('admin_reply', sa.Text(), nullable=True),
        sa.Column('admin_reply_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('product_comments')
