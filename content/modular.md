---
title: A Modular Religion
---

If you squint, the church has a plugin architecture.[^mashup]

Firmness is an interface: Self-leadership under provocation. Something has to stir up your material, and the circle has to be able to watch your reaction. Anything that satisfies this interface can plug in.

```python
class Firmness(Protocol):
    def provoke(self, person: Person) -> None: ...
    def witness(self, circle: Circle, person: Person) -> Response: ...

class Church:
    def __init__(self, backend: Firmness):
        self.backend = backend

    def test(self, aspirant: Person, circle: Circle) -> Response:
        self.backend.provoke(aspirant)
        return self.backend.witness(circle, aspirant)

church = Church(backend=SantoDaime())
```

## The Reference Implementation

Santo Daime already does this. A Daime work provokes with ayahuasca, and the tradition has a name for passing: *firmeza*. Decades of battle-testing is hard to beat, so we treat it as the reference implementation.

## Other Backends

Nothing about firmness belongs to the Daime. Another tradition could implement the interface. The test is simple: does it reliably provoke, and can the circle witness the response?

## What Stays the Same

Kykeon, the circle, and the healing that prepares us stay the same whichever backend you plug in. That's ours.

Alcoholics Anonymous sets a similar precedent. The twelve steps and the fellowship are fixed, while the higher power is "God as we understood Him."[^aa] Different slot, same design pattern. 🤓

Back to the [manifesto](/manifesto/#the-role-of-kykeon).

[^mashup]: Yes, we are annotating a Bronze Age barley drink with Python type hints. Demeter, who survived the fall of Mycenae, will survive this too.
[^aa]: AA has run this architecture since 1939 with no interface definition and no type checker, and the higher power is typed as `Any`. The spec is a book. The CI pipeline is a coffee urn. The only unit test is whether you called your sponsor. Exception handling is the Serenity Prayer, and it has somehow never needed a patch. 🤦👎🏿
