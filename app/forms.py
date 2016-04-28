from wtforms import FileField
from wtforms.validators import Required

class UploadForm():
    filepath = FileField()