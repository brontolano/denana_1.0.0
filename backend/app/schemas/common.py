from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CoreBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(CoreBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
