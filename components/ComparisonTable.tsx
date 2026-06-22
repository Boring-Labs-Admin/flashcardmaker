import { Check } from 'lucide-react';
import { PLANS } from '@/lib/plans';

export default function ComparisonTable() {
  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th></th>
            <th>Anonymous</th>
            <th>Free account</th>
            <th className="plus-col">Plus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Generations</td>
            <td>1 / day</td>
            <td>1 / day, banks to {PLANS.free.maxBanked}</td>
            <td className="plus-col">Unlimited</td>
          </tr>
          <tr>
            <td>Cards per deck</td>
            <td>{PLANS.free.cardLimit}</td>
            <td>{PLANS.free.cardLimit}</td>
            <td className="plus-col">{PLANS.plus.cardLimit}</td>
          </tr>
          <tr>
            <td>Character input</td>
            <td>{PLANS.free.charLimit.toLocaleString()}</td>
            <td>{PLANS.free.charLimit.toLocaleString()}</td>
            <td className="plus-col">{PLANS.plus.charLimit.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Files per generation</td>
            <td>{PLANS.free.fileLimit}</td>
            <td>{PLANS.free.fileLimit}</td>
            <td className="plus-col">{PLANS.plus.fileLimit}</td>
          </tr>
          <tr>
            <td>AI topic generation</td>
            <td>—</td>
            <td>—</td>
            <td className="plus-col"><Check size={16} strokeWidth={2.5} /></td>
          </tr>
          <tr>
            <td>Save · test · PDF export</td>
            <td>—</td>
            <td><Check size={16} strokeWidth={2.5} /></td>
            <td className="plus-col"><Check size={16} strokeWidth={2.5} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
