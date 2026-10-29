"""Add language to User

Revision ID: b7f2c94e0a51
Revises: fe56fa70289e
Create Date: 2026-10-29 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'b7f2c94e0a51'
down_revision = 'fe56fa70289e'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('language', sqlmodel.sql.sqltypes.AutoString(length=16), nullable=True))


def downgrade():
    op.drop_column('user', 'language')
