import bcrypt
from app.database import SessionLocal
from app.models.user import User, UserRole, AuthProvider

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

db = SessionLocal()

existing = db.query(User).filter(User.email == "threadtalesbyteju946@gmail.com").first()
if existing:
    existing.role = UserRole.admin
    existing.hashed_password = hash_password("Talesteju@469!")
    existing.is_active = True
    existing.is_verified = True
    db.commit()
    print("Existing user promoted to admin with updated password!")
else:
    admin = User(
        full_name="Teju",
        email="threadtalesbyteju946@gmail.com",
        hashed_password=hash_password("Talesteju@469!"),
        role=UserRole.admin,
        auth_provider=AuthProvider.local,
        is_active=True,
        is_verified=True,
    )
    db.add(admin)
    db.commit()
    print("Admin user created!")

db.close()
