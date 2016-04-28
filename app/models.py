class Sequence(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    order = db.Column(db.Integer, unique=True)
    
    def __init__(self, sequence):
        self.name = sequence

class Word(db.Model):
    word = db.Column(db.String(80), primary_key=True)
    sequence = db.Column(db.Integer, unique=True)
    count = db.Column(db.Integer)
    rank = db.Column(db.Integer, index=True)

    def __init__(self, sequence, word, rank, count):
        self.word = word
        self.sequence = sequence
        self.rank = rank
        self.count = count

    def __repr__(self):
        return '<Word %r>' % self.word
    