from pkg_resources import resource_stream
import pronouncing
from difflib import SequenceMatcher

# Dummy MFA alignment simulation
# In real case, replace with alignment output

def get_phonemes(text):
    phonemes = []
    for word in text.split():
        p = pronouncing.phones_for_word(word.lower())
        if p:
            phonemes += p[0].split()
    return phonemes

def get_pronunciation_score(expected: str, actual: str):
    expected_phonemes = get_phonemes(expected)
    actual_phonemes = get_phonemes(actual)
    matches = sum(1 for e, a in zip(expected_phonemes, actual_phonemes) if e == a)
    score = round((matches / len(expected_phonemes)) * 100, 2) if expected_phonemes else 0.0
    return score, expected_phonemes, actual_phonemes