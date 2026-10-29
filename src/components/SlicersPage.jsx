import { glossary, SLICER_NAMES } from '../data/glossary.js'

export default function SlicersPage() {
  const entries = Object.entries(glossary).filter(([, g]) => g.prusa)
  return (
    <div className="page page--wide">
      <header className="page__intro">
        <h1>Slicer names</h1>
        <p>
          This guide uses generic setting names. Here is what each slicer calls them. Settings marked{' '}
          <sup className="fn-mark">*</sup> elsewhere in the app are the ones with surprising names.
        </p>
      </header>
      <div className="table-wrap">
        <table className="compare compare--glossary">
          <thead>
            <tr>
              <th scope="col">In this guide</th>
              <th scope="col">{SLICER_NAMES.prusa}</th>
              <th scope="col">{SLICER_NAMES.orca}</th>
              <th scope="col">{SLICER_NAMES.cura}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([k, g]) => (
              <tr key={k}>
                <th scope="row">
                  {g.name}
                  {g.unintuitive && <sup className="fn-mark">*</sup>}
                </th>
                <td>{g.prusa}</td>
                <td>{g.orca}</td>
                <td>{g.cura}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine">
        Based on PrusaSlicer 2.x, OrcaSlicer 2.x (Bambu Studio uses largely the same names) and Cura 5.x. Labels move between releases, so use these as search terms in your slicer’s settings.
      </p>
    </div>
  )
}
