---
title: "Projects"
description: "Things Seyoon Park has built."
---

{{< projects >}}

{{< project name="research-advisor" url="https://github.com/fenwickyduck/research-advisor" meta="Python · FastAPI · SPECTER · MCP" >}}
A local advisor for research papers. It harvests arXiv `cs.CR` and the Cryptology ePrint Archive, embeds all 76,000 abstracts with SPECTER, and ranks them against your reading history and the preferences you state. An AI assistant can consult it over MCP; the recommending itself never calls a model, so it runs on a CPU with no API key and your reading stays on the machine.
{{< /project >}}

{{< project name="pdf2csv" url="https://github.com/fenwickyduck/pdf2csv" meta="Python · CLI · TOML" >}}
A self-verifying command-line tool that converts bank statement PDFs to CSV. It rebuilds tables from raw word coordinates, keeps each bank's layout in a TOML config, so supporting a new bank needs no code.
{{< /project >}}

{{< /projects >}}
