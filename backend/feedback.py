def generate_feedback(expected, actual, score, expected_phonemes, actual_phonemes):
    if score < 60:
        hint = f"You said '{actual}'. Try saying '{expected}' with clearer sounds. Focus on: {expected_phonemes}"
    elif score < 80:
        hint = f"Almost perfect! Just work a bit on: {set(expected_phonemes) - set(actual_phonemes)}"
    else:
        hint = "Great pronunciation!"
    return hint
