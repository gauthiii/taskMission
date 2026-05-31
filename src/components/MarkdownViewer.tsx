import React, { useEffect } from 'react'
import md from '../data/servicenow_p1_example3.md?raw'

export type Heading = { level: number; text: string; id: string }
export type HeadingGroup = { heading: Heading; items: string[] }
export type ParsedPlan = { title?: string; headings: Heading[]; groups: HeadingGroup[] }

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderInline(raw: string) {
  // escape first
  let s = escapeHtml(raw)
  // images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" class="md-img" />')
  // links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  // bold **text**
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // strike ~~text~~
  s = s.replace(/~~(.*?)~~/g, '<del>$1</del>')
  // italic *text* (avoid clobbering bold)
  s = s.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // inline code `code`
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  return s
}
function renderMarkdownToHtml(raw: string) {
  const lines = raw.split(/\r?\n/)
  const out: string[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    // headings
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      const level = Math.min(6, h[1].length)
      const rawText = h[2].trim()
      const text = renderInline(rawText)
      const id = slugify(rawText)
      out.push(`<h${level} id="${id}">${text}</h${level}>\n`)
      i++
      continue
    }

    // fenced code
    const fence = line.match(/^```\s*(\w+)?/) 
    if (fence) {
      const lang = fence[1] || ''
      let j = i + 1
      const codeLines: string[] = []
      while (j < lines.length && !lines[j].startsWith('```')) {
        codeLines.push(lines[j])
        j++
      }
        const codeText = codeLines.join('\n')

        // detect file-tree (lines starting with ├ or └) and render as styled list
        if (/^[\s]*[├└]──/m.test(codeText)) {
          const rows = codeText.split(/\r?\n/).map((r) => r.trim()).filter(Boolean)
          out.push('<div class="md-file-tree">')
          for (const r of rows) {
            // split on <-- comment marker if present
            const parts = r.split('<--')
            const name = parts[0].replace(/^[├└]──\s*/,'').trim()
            const desc = parts[1] ? parts[1].trim() : ''
            out.push(`<div class="file-row"><span class="file-name">${escapeHtml(name)}</span>${desc?`<div class="file-desc">${escapeHtml(desc)}</div>`:''}</div>`)
          }
          out.push('</div>')
        } else if (/[┌┐└┘│─▲▼▼]/.test(codeText) && /Resource\s*1/i.test(codeText)) {
          // simple org-chart detection: parse named blocks
          // attempt to extract lines with 'Resource' and team names
          const names: string[] = []
          const linesIn = codeText.split(/\r?\n/)
          for (const ln of linesIn) {
            const m = ln.match(/Resource\s*\d+:?\s*(.*)/i)
            if (m) names.push(m[1].trim())
            const m2 = ln.match(/ServiceNow Devs|SecOps & Cyber|Data & AI Eng\./i)
            if (m2) names.push(m2[0].trim())
          }
          if (names.length) {
            out.push('<div class="md-org-grid">')
            // render first as leader then others
            if (names[0]) out.push(`<div class="org-leader"><strong>${escapeHtml(names[0])}</strong></div>`)
            out.push('<div class="org-row">')
            for (let k = 1; k < names.length; k++) {
              out.push(`<div class="org-card">${escapeHtml(names[k])}</div>`)
            }
            out.push('</div></div>')
          } else {
            out.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(codeText)}</code></pre>`)
          }
        } else {
          out.push(`<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(codeText)}</code></pre>`)
        }
      i = j + 1
      continue
    }

    // table (simple): detect a block with pipes
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\s*\|?\s*[-:]+\s*\|/)) {
      // parse table until blank line
      const rows: string[][] = []
      let j = i
      while (j < lines.length && lines[j].trim() !== '') {
        const cols = lines[j].split('|').map((c) => c.trim()).filter((c) => c !== '')
        rows.push(cols)
        j++
      }
      if (rows.length) {
        out.push('<table class="md-table">')
        out.push('<thead>')
        out.push('<tr>' + rows[0].map((c) => `<th>${renderInline(c)}</th>`).join('') + '</tr>')
        out.push('</thead>')
        if (rows.length > 1) {
          out.push('<tbody>')
          for (let k = 1; k < rows.length; k++) {
            out.push('<tr>' + rows[k].map((c) => `<td>${renderInline(c)}</td>`).join('') + '</tr>')
          }
          out.push('</tbody>')
        }
        out.push('</table>')
      }
      i = j
      continue
    }

    // unordered list
    if (line.match(/^\s*[-*+]\s+/)) {
      out.push('<ul>')
      let j = i
      while (j < lines.length && lines[j].match(/^\s*[-*+]\s+/)) {
        const m = lines[j].match(/^\s*[-*+]\s+(.*)$/)
        out.push(`<li>${renderInline(m ? m[1] : '')}</li>`)
        j++
      }
      out.push('</ul>')
      i = j
      continue
    }

    // ordered list
    if (line.match(/^\s*\d+\.\s+/)) {
      out.push('<ol>')
      let j = i
      while (j < lines.length && lines[j].match(/^\s*\d+\.\s+/)) {
        const m = lines[j].match(/^\s*\d+\.\s+(.*)$/)
        out.push(`<li>${renderInline(m ? m[1] : '')}</li>`)
        j++
      }
      out.push('</ol>')
      i = j
      continue
    }

    // paragraph or blank
    if (line.trim() === '') {
      // blank line -> paragraph separator, skip emitting empty <p>
      i++
      continue
    }

    // paragraph with inline formatting
    const text = renderInline(line)
    out.push(`<p>${text}</p>`)
    i++
  }

  return out.join('\n')
}

export function MarkdownViewer({ onParse }: { onParse?: (p: ParsedPlan) => void }) {
  useEffect(() => {
    const lines = md.split(/\r?\n/)
    const headings: Heading[] = []
    const groups: HeadingGroup[] = []
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(/^(#{1,6})\s+(.*)$/)
      if (h) {
        const level = h[1].length
        const text = h[2].trim()
        const id = slugify(text)
        const heading: Heading = { level, text, id }
        headings.push(heading)

        const items: string[] = []
        let j = i + 1
        for (; j < lines.length; j++) {
          const nextH = lines[j].match(/^(#{1,6})\s+(.*)$/)
          if (nextH) break
          const li = lines[j].match(/^\s*[-*+]\s+(.*)$/) || lines[j].match(/^\s*\d+\.\s+(.*)$/)
          if (li) items.push(li[1].trim())
        }
        groups.push({ heading, items })
      }
    }
    const titleCandidate = headings.length ? headings[0].text : undefined
    const parsed = { title: titleCandidate, headings, groups }
    onParse && onParse(parsed)
  }, [onParse])

  const html = renderMarkdownToHtml(md)
  return <article className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
}

export default MarkdownViewer
