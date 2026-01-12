import './qlik-ioconnect-channels.css';

define(['jquery', 'qlik'], function ($, qlik) {  'use strict';
  // Global io.Connect instance
  let ioInstance = null;
  let isInitializing = false;
  let initializationPromise = null;

  /**
   * Initialize io.Connect Browser
   */
  async function initializeIOConnect(config) {
    console.log('Initializing io.Connect Browser...');
    const desktopConfig = { channels: true };

    ioInstance = await IODesktop(desktopConfig);

    console.log(`io.Connect JS version ${ioInstance.version} has been successfully initialized!`);
    console.log(`Channels are ${ioInstance.channels ? "enabled" : "disabled"}.`);
    if (ioInstance) {
      console.log('returning io.Connect instance:', ioInstance);
      return ioInstance;
    }

    // if (isInitializing) {
    //   return initializationPromise;
    // }

    // isInitializing = true;
    // initializationPromise = IOBrowser({
    //   gateway: {
    //     location: config.gatewayUrl || 'http://localhost:8385'
    //   },
    //   channels: {
    //     enabled: true
    //   }
    // }).then(io => {
    //   ioInstance = io;
    //   isInitializing = false;
    //   console.log('✓ io.Connect Browser initialized. Version:', io.version);
    //   return io;
    // }).catch(error => {
    //   isInitializing = false;
    //   console.error('✗ Failed to initialize io.Connect Browser:', error);
    //   throw error;
    // });

    return ioInstance;
  }

  /**
   * Publish data to an io.Connect channel
   */
  async function publishToChannel(io, channelName, data) {
    console.log(`Publishing data to channel: ${channelName}`, data);
    console.log('Current io.Connect version:', io.version);
    try {
      const channels = await io.channels.list();
      let channel = channels.find(ch => ch.name === channelName);

      if (!channel) {
        console.log(`Creating new channel: ${channelName}`);
        channel = await io.channels.publish(data, channelName);
      } else {
        console.log(`Publishing to existing channel: ${channelName}`);
        await io.channels.publish(data, channelName);
      }

      console.log('✓ Data published to channel:', channelName, data);
      return { success: true, channel: channelName };
    } catch (error) {
      console.error('✗ Failed to publish to channel:', error);
      throw error;
    }
  }

  return {
    // Extension definition for property panel
    definition: {
      type: "items",
      component: "accordion",
      items: {
        dimensions: {
          uses: "dimensions",
          min: 0,
          max: 3
        },
        measures: {
          uses: "measures",
          min: 1,
          max: 10
        },
        sorting: {
          uses: "sorting"
        },
        settings: {
          uses: "settings",
          items: {
            ioConnectSettings: {
              type: "items",
              label: "io.Connect Settings",
              items: {
                gatewayUrl: {
                  type: "string",
                  label: "Gateway URL",
                  ref: "ioConnect.gatewayUrl",
                  defaultValue: "http://localhost:8385",
                  expression: "optional"
                },
                channelName: {
                  type: "string",
                  label: "Channel Name",
                  ref: "ioConnect.channelName",
                  defaultValue: "QlikData",
                  expression: "optional"
                },
                autoInitialize: {
                  type: "boolean",
                  label: "Auto-initialize io.Connect",
                  ref: "ioConnect.autoInitialize",
                  defaultValue: true
                },
                showConnectionStatus: {
                  type: "boolean",
                  label: "Show Connection Status",
                  ref: "ioConnect.showStatus",
                  defaultValue: true
                }
              }
            },
            displaySettings: {
              type: "items",
              label: "Display Settings",
              items: {
                tableStyle: {
                  type: "string",
                  component: "dropdown",
                  label: "Table Style",
                  ref: "display.tableStyle",
                  options: [
                    { value: "standard", label: "Standard" },
                    { value: "striped", label: "Striped" },
                    { value: "bordered", label: "Bordered" }
                  ],
                  defaultValue: "standard"
                },
                showRowButtons: {
                  type: "boolean",
                  label: "Show Row Action Buttons",
                  ref: "display.showRowButtons",
                  defaultValue: true
                },
                buttonLabel: {
                  type: "string",
                  label: "Button Label",
                  ref: "display.buttonLabel",
                  defaultValue: "Publish",
                  show: function (data) {
                    return data.display.showRowButtons;
                  }
                }
              }
            }
          }
        }
      }
    },

    // Initial properties
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{
          qWidth: 20,
          qHeight: 100
        }]
      },
      ioConnect: {
        gatewayUrl: "http://localhost:8385",
        channelName: "Blue",
        autoInitialize: true,
        showStatus: true
      },
      display: {
        tableStyle: "standard",
        showRowButtons: true,
        buttonLabel: "Publish"
      }
    },

    // Support options
    support: {
      snapshot: true,
      export: true,
      exportData: true
    },

    // Main paint function
    paint: function ($element, layout) {
      const self = this;
      const hypercube = layout.qHyperCube;
      const config = layout.ioConnect || {};
      //const display = layout.display || {};
      const display = {
        tableStyle: 'standard',
        showRowButtons: true,
        buttonLabel: 'Publish',
        ...(layout.display || {})
      };

      // Clear previous content
      $element.empty();

      // Create container
      const $container = $('<div class="ioconnect-container"></div>');
      $element.append($container);

      // Add connection status if enabled
      if (config.showStatus) {
        const statusClass = ioInstance ? 'connected' : 'disconnected';
        const statusText = ioInstance
          ? `✓ Connected to ${config.gatewayUrl}`
          : '✗ Not connected';

        $container.append(`
          <div class="io-status ${statusClass}">
            <span class="status-indicator"></span>
            <span class="status-text">${statusText}</span>
            ${!ioInstance && config.autoInitialize ? '<button class="io-connect-btn">Connect</button>' : ''}
          </div>
        `);
      }

      // Create data table
      const $table = $('<table class="io-data-table"></table>');
      $table.addClass(`table-${display.tableStyle}`);

      // Build table header
      const $thead = $('<thead></thead>');
      const $headerRow = $('<tr></tr>');

      hypercube.qDimensionInfo.forEach(dim => {
        $headerRow.append(`<th class="dimension">${dim.qFallbackTitle}</th>`);
      });

      hypercube.qMeasureInfo.forEach(measure => {
        $headerRow.append(`<th class="measure">${measure.qFallbackTitle}</th>`);
      });

      if (display.showRowButtons) {
        $headerRow.append('<th class="action-column">Action</th>');
      }

      $thead.append($headerRow);
      $table.append($thead);

      // Build table body
      const $tbody = $('<tbody></tbody>');

      if (hypercube.qDataPages && hypercube.qDataPages[0]) {
        hypercube.qDataPages[0].qMatrix.forEach((row, rowIndex) => {
          const $row = $('<tr></tr>');
          $row.attr('data-row-index', rowIndex);

          // Add data cells
          row.forEach((cell, cellIndex) => {
            const $cell = $('<td></td>');
            $cell.text(cell.qText);
            $cell.attr('data-value', cell.qNum);
            $cell.attr('data-elem-number', cell.qElemNumber);
            $row.append($cell);
          });

          // Add action button
          if (display.showRowButtons) {
            const $actionCell = $('<td class="action-cell"></td>');
            const $button = $('<button class="publish-btn"></button>');
            $button.text(display.buttonLabel || 'Publish');
            $button.attr('data-row-index', rowIndex);
            $actionCell.append($button);
            $row.append($actionCell);
          }

          $tbody.append($row);
        });
      } else {
        $tbody.append('<tr><td colspan="100">No data available</td></tr>');
      }

      $table.append($tbody);
      $container.append($table);

      // Event handler: Connect button
      $container.find('.io-connect-btn').on('click', async function () {
        const $btn = $(this);
        $btn.prop('disabled', true).text('Connecting...');

        try {
          await initializeIOConnect(config);
          self.paint($element, layout); // Repaint to show connected status
        } catch (error) {
          alert('Failed to connect to io.Connect: ' + error.message);
          $btn.prop('disabled', false).text('Connect');
        }
      });

      // Event handler: Publish button click
      $container.find('.publish-btn').on('click', async function (e) {
        e.stopPropagation();

        const $btn = $(this);
        const rowIndex = $btn.data('row-index');
        const rowData = hypercube.qDataPages[0].qMatrix[rowIndex];

        // Initialize io.Connect if not already done
        if (!ioInstance) {
          try {
            $btn.prop('disabled', true).text('Connecting...');
            await initializeIOConnect(config);
          } catch (error) {
            alert('Failed to connect to io.Connect: ' + error.message);
            $btn.prop('disabled', false).text(display.buttonLabel || 'Publish');
            return;
          }
        }

        // Prepare data payload
        const payload = {
          source: 'Qlik Sense',
          appName: layout.qInfo.qId,
          timestamp: new Date().toISOString(),
          rowIndex: rowIndex,
          data: {}
        };

        // Add dimensions
        hypercube.qDimensionInfo.forEach((dim, i) => {
          payload.data[dim.qFallbackTitle] = {
            text: rowData[i].qText,
            number: rowData[i].qNum,
            elementNumber: rowData[i].qElemNumber
          };
        });

        // Add measures
        const measureOffset = hypercube.qDimensionInfo.length;
        hypercube.qMeasureInfo.forEach((measure, i) => {
          payload.data[measure.qFallbackTitle] = {
            text: rowData[measureOffset + i].qText,
            number: rowData[measureOffset + i].qNum
          };
        });

        // Publish to channel
        try {
          $btn.prop('disabled', true).text('Publishing...');
          console.log('Publishing payload:', payload);
          console.log('Using io.Connect instance:', ioInstance);
          await publishToChannel(ioInstance, config.channelName, payload);

          // Visual feedback
          $btn.addClass('success').text('Published!');
          setTimeout(() => {
            $btn.removeClass('success')
              .prop('disabled', false)
              .text(display.buttonLabel || 'Publish');
          }, 2000);

        } catch (error) {
          console.error('Publish error:', error);
          $btn.addClass('error').text('Failed!');
          setTimeout(() => {
            $btn.removeClass('error')
              .prop('disabled', false)
              .text(display.buttonLabel || 'Publish');
          }, 2000);
          alert('Failed to publish: ' + error.message);
        }
      });

      // Event handler: Row click (optional - publish entire row)
      $container.find('tbody tr').on('dblclick', async function () {
        const $row = $(this);
        const rowIndex = $row.data('row-index');

        // Trigger the publish button for this row
        $row.find('.publish-btn').trigger('click');
      });

      // Auto-initialize if configured
      if (config.autoInitialize && !ioInstance && !isInitializing) {
        initializeIOConnect(config).catch(error => {
          console.warn('Auto-initialization failed:', error);
        });
      }

      return qlik.Promise.resolve();
    }
  };
});
