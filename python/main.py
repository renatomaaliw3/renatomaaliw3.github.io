# Imports

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import io
from pyscript import display
from pyodide.http import open_url

import warnings
warnings.filterwarnings('ignore')

from matplotlib.ticker import FormatStrFormatter

url = "checkpoint/cpe21-24-25.json"  # Adjust the path if needed
response = open_url(url)
data_str = response.read()  # Already a string, no need to decode
df = pd.read_json(io.StringIO(data_str))

# Prelim Graphs

course = 'CPE21'
term = 'Preliminary'
# email = my_email_value

# your_grade = df.query("Email == @email and Term == @term")['Lecture Term Grade (60%)'].values.flatten()[0]
mean_grade = df['Lecture Term Grade (60%)'].mean()

# Prelims Histogram

course = 'CPE21'
term = 'Preliminary'
email = 'anj@mail.com'
your_grade = df.query("Email == @email and Term == @term")['Lecture Term Grade (60%)'].values.flatten()[0]
mean_grade = df['Lecture Term Grade (60%)'].mean()

fig, ax = plt.subplots(1,2, figsize = (15, 5))
fig.suptitle('Preliminary Term Statistics', fontweight = 'bold', fontsize = 15)

# 1st Graph
ax[0].set_title(f'Histogram of Lecture Grades')
sns.histplot(df['Lecture Term Grade (60%)'], kde = False, bins = 20, color = 'aqua', stat = 'density', ax = ax[0])
sns.kdeplot(df['Lecture Term Grade (60%)'], color = 'black', linewidth = 3, alpha = 0.75, zorder = 10, ax = ax[0])
ax[0].axvline(mean_grade, linestyle = '--', color = 'red', linewidth = 3, label = f'Average Lecture Grade is {mean_grade:.3f}', alpha = 0.75)
# ax[0].axvline(your_grade, linestyle = '--', color = 'blue', linewidth = 2, label = f'Your Grade is {round(your_grade, 3)}', alpha = 0.75)
ax[0].legend(loc = 'upper left')
ax[0].set_xlabel(f'Lecture Term Grades')
ax[0].grid(True, linestyle = '--', alpha = 0.5)

# 2nd Graph

ax[1].set_title(f'Count Plot of Lecture Grades (Equivalent)')
ax[1] = sns.countplot(x = 'Lecture Term Grade (E)', data = df, color = 'orange', alpha = 0.85)
# ax[1].legend(loc = 'upper left')
# ax[1].set_xlabel(f'{term} Term Grades (E)')
ax[1].grid(True, linestyle = '--', alpha = 0.5)


# Annotate each bar with the count value
for p in ax[1].patches:

    height = p.get_height()
    ax[1].text(p.get_x() + p.get_width() / 2, height + 0.08, f'{int(height)}', 
            ha='center', va='bottom')
    
# Reformat the x-axis tick labels to show two decimals
ax[1].set_xticklabels([f'{float(label.get_text()):.2f}' for label in ax[1].get_xticklabels()])

# Calculate the maximum count from the count plot
max_count = max(p.get_height() for p in ax[1].patches)

# Set the x-axis limits on the second subplot to be from 0 to 0.5 times the maximum count
ax[1].set_ylim(0, 4 + max_count)
    
plt.tight_layout()

display(fig, target="grph")