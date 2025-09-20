import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { apiConfig } from './app.config';

interface PredictionRow {
  asset: string;
  prediction: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('asset-predict-web');

  assets = [
    'BTCI11',
    'BTAG11',
    'PETR4', 
    'GOGL34',
    'JPMC34',
    'VALE3', 
    'ITUB4', 
    'BBDC4', 
    'ABEV3', 
    'MGLU3'  
  ];
  selectedAsset = '';
  predictionRows: PredictionRow[] = [];

  constructor(private dialog: MatDialog) {}

  async callPredictionApi(ticker: string): Promise<string> {
    try {
      const response = await fetch(`${apiConfig.predictionUrl}/api/b3/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "ticker": ticker })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (Array.isArray(data.predictions) && data.predictions.length > 0) {
        return data.predictions[0];
      }
      return 'No prediction returned';
    } catch (err) {
      console.error('Prediction API error:', err);
      return 'Prediction failed';
    }
  }

  async onPredict() {
    if (!this.selectedAsset) return;
    const result = await this.callPredictionApi(this.selectedAsset);
    const dialogRef = this.dialog.open(PredictionDialog, {
      data: { prediction: result }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.predictionRows = [
        ...this.predictionRows,
        { asset: this.selectedAsset, prediction: result }
      ];
    });
  }
}

import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component as DialogComponent } from '@angular/core';

@DialogComponent({
  selector: 'prediction-dialog',
  template: `
    <h2 mat-dialog-title>Prediction</h2>
    <mat-dialog-content>
      <p>The model suggests: <b>{{ data.prediction }}</b></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class PredictionDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { prediction: string }) {}
}
