import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { apiConfig } from './app.config';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface PredictionRow {
  asset: string;
  prediction: string;
  datetime: string;
}

@Component({
  selector: 'asset-search-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule, NgIf],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Search Asset</mat-label>
      <input
        matInput
        type="text"
        [(ngModel)]="searchTerm"
        [matAutocomplete]="auto"
        (ngModelChange)="onSearchChange($event)"
        placeholder="Type at least 3 characters..."
        autocomplete="off"
        style="background: #fff;"
      />
      <button *ngIf="searchTerm" matSuffix mat-icon-button aria-label="Clear" (mousedown)="$event.preventDefault()" (click)="clearSearch()" style="margin-right: 4px; background: #f5f5f5; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.04); width: 24px; height: 24px; min-width: 24px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #888; font-size: 14px; font-weight: bold; line-height: 1;">×</span>
      </button>
      <mat-progress-bar *ngIf="loading" mode="indeterminate" color="accent" style="position: absolute; left: 0; right: 0; top: 0; height: 3px;"></mat-progress-bar>
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn.bind(this)" (optionSelected)="onSelect($event.option.value)">
        <mat-option *ngFor="let asset of assets" [value]="asset">
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; color: #1976d2;">{{ asset.ticker }}</span>
            <span style="font-size: 0.9em; color: #555;">{{ asset.company }}</span>
          </div>
        </mat-option>
        <mat-option *ngIf="!loading && assets.length === 0">
          <span style="color: #888;">No assets found</span>
        </mat-option>
        <mat-option *ngIf="pagination.total_pages > 1" disabled>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px 0;">
            <button mat-stroked-button color="primary" (mousedown)="prevPage($event)" [disabled]="!pagination.has_prev" style="min-width: 60px; pointer-events: auto;">Prev</button>
            <span style="margin: 0 8px;">Page {{ pagination.page }} / {{ pagination.total_pages }}</span>
            <button mat-stroked-button color="primary" (mousedown)="nextPage($event)" [disabled]="!pagination.has_next" style="min-width: 60px; pointer-events: auto;">Next</button>
          </div>
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styleUrls: [],
})
export class AssetSearchDropdownComponent {
  @Input() pageSize = 10;
  @Output() assetSelected = new EventEmitter<string>();
  searchTerm = '';
  selectedTicker = '';
  assets: { ticker: string; company: string }[] = [];
  pagination = { page: 1, page_size: 10, total_count: 0, total_pages: 1, has_next: false, has_prev: false };
  loading = false;

  ngOnInit() {
    this.fetchAssets();
  }

  async fetchAssets(page = 1) {
    this.loading = true;
    let url = `${apiConfig.assetsUrl}/assets?page=${page}&page_size=${this.pageSize}`;
    if (this.searchTerm && this.searchTerm.length >= 3) {
      url += `&search=${encodeURIComponent(this.searchTerm)}`;
    }
    const resp = await fetch(url, { headers: { accept: 'application/json' } });
    const data = await resp.json();
    this.assets = data.assets || [];
    this.pagination = data.pagination || this.pagination;
    this.loading = false;
  }

  onSearchChange(term: string) {
    this.pagination.page = 1;
    if (!term || term.length < 3) {
      this.searchTerm = '';
      this.selectedTicker = '';
      this.assetSelected.emit('');
      this.fetchAssets(1);
    } else {
      this.searchTerm = term;
      this.fetchAssets(1);
    }
  }

  onSelect(asset: { ticker: string; company: string }) {
    this.selectedTicker = asset.ticker;
    this.assetSelected.emit(asset.ticker);
  }

  nextPage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.pagination.has_next) {
      this.fetchAssets(this.pagination.page + 1);
    }
  }

  prevPage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.pagination.has_prev) {
      this.fetchAssets(this.pagination.page - 1);
    }
  }

  displayFn(asset: { ticker: string; company: string }) {
    return asset ? asset.ticker : '';
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedTicker = '';
    this.assetSelected.emit('');
    this.fetchAssets(1);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    AssetSearchDropdownComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('asset-predict-web');
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
        { 
          asset: this.selectedAsset, 
          prediction: result,
          datetime: new Date().toLocaleString()
        }
      ];
    });
  }
  onAssetSelected(ticker: string) {
    this.selectedAsset = ticker;
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
