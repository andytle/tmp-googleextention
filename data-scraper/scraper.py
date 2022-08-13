import math 
import requests
import json

class RateMyProfScraper:
	def __init__(self,schoolid):
		self.UniversityId = schoolid
		self.professorlist = self.createprofessorlist()

	def createprofessorlist(self):
		tempprofessorlist = []
		num_of_prof = self.GetNumOfProfessors(self.UniversityId)
		num_of_pages = math.ceil(num_of_prof / 20)
		i = 1
		while (i <= num_of_pages):
			page = requests.get("http://www.ratemyprofessors.com/filter/professor/?&page=" + str(
				i) + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=" + str(
				self.UniversityId))
			temp_jsonpage = json.loads(page.content)
			temp_list = temp_jsonpage['professors']
			tempprofessorlist.extend(temp_list)
			print(f"Crawling from page {i}")
			i += 1
		return tempprofessorlist

	def GetNumOfProfessors(self,id):
		page = requests.get(
			"http://www.ratemyprofessors.com/filter/professor/?&page=2&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=" + str(
					id)) 
		temp_jsonpage = json.loads(page.content)
		num_of_prof = temp_jsonpage['searchResultsTotal']
		return num_of_prof

	def exportData(self):
		file = open('dpu_rmp_data.json', 'w+', encoding="utf-8")
		file.write(json.dumps(self.professorlist, indent=4))
		print(f"{len(self.professorlist)} professors exported to file")


DePauw = RateMyProfScraper(1523)
DePauw.exportData()
