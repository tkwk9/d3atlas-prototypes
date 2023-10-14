import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";

import "./Table.scss";

const Table = () => {
  return (
    <div class="Table">
      <h1 class="title">Table: A2</h1>
      <table>
        <tbody>
          <tr>
            <th>A</th>
            <th>B</th>
            <th>C</th>
          </tr>
          <tr>
            <td rowspan="2">1</td>
            <td>1</td>
            <td>1</td>
          </tr>
          <tr>
            <td>2</td>
            <td>2</td>
          </tr>
          <tr>
            <td>3</td>
            <td>3</td>
            <td>3</td>
          </tr>
          <tr>
            <td>4</td>
            <td>4</td>
            <td>4</td>
          </tr>
          <tr>
            <td>5</td>
            <td>5</td>
            <td>5</td>
          </tr>
          <tr>
            <td>6</td>
            <td>6</td>
            <td>6</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
