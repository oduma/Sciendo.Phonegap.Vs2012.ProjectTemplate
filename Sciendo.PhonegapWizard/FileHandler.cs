using System.Collections.Generic;
using EnvDTE;
using Microsoft.VisualStudio.TemplateWizard;

namespace Sciendo.PhonegapWizard
{
    public class FileHandler : IWizard
    {

        public void RunStarted(object automationObject, Dictionary<string, string> replacementsDictionary,
                               WizardRunKind runKind, object[] customParams)
        {
        }

        public void ProjectFinishedGenerating(Project project)
        {
        }

        public void ProjectItemFinishedGenerating(ProjectItem projectItem)
        {
        }

        public bool ShouldAddProjectItem(string filePath)
        {
            bool retValue = filePath != "Placeholder.txt";
            return retValue;
        }

        public void BeforeOpeningFile(ProjectItem projectItem)
        {
        }

        public void RunFinished()
        {
        }
    }
}
