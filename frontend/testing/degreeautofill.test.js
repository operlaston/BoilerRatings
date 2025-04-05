import { aggregateCoreRequirementsIntoArray, sortCoursesForAutofill, sortCoursesForAutofillLowestDifficulty  } from '../src/utils/degreeUtils.js';

const sanity_1_majors = [
  {
    "requirements": [
      {
        "name": "SANITY_1 Core",
        "subrequirements": [
          {
            "credits": 1,
            "courses": [
              "ONLY_COURSE"
            ],
          },
          {
            "credits": 1,
            "courses": [
              "ELECTIVE_COURSE_1", "ELECTIVE_COURSE_2"
            ],
          },
        ],
      },
      {
        "name": "SANITY_1 ELECTIVE",
        "subrequirements": [
          {
            "credits": 1,
            "courses": [
              "ELECTIVE_COURSE_1", "ELECTIVE_COURES_2"
            ],
          },
          {
            "credits": 1,
            "courses": [
              "ELECTIVE_COURSE_3", "ELECTIVE_COURSE_4"
            ],
          },
        ],
      }
    ],
  }
]

const cs_major = [
  {
    "name": "Computer Science",
    "requirements": [
      {
        "name": "Computer Science Core",
        "subrequirements": [
          {
            "credits": 4,
            "courses": [
              "CS 18000"
            ],
            "_id": "67edba8a7fd5ff1d45674e6b"
          },
          {
            "credits": 3,
            "courses": [
              "CS 18200"
            ],
            "_id": "67edba8a7fd5ff1d45674e6c"
          },
          {
            "credits": 3,
            "courses": [
              "CS 24000"
            ],
            "_id": "67edba8a7fd5ff1d45674e6d"
          },
          {
            "credits": 4,
            "courses": [
              "CS 25000"
            ],
            "_id": "67edba8a7fd5ff1d45674e6e"
          },
          {
            "credits": 3,
            "courses": [
              "CS 25100"
            ],
            "_id": "67edba8a7fd5ff1d45674e6f"
          },
          {
            "credits": 3,
            "courses": [
              "CS 25200"
            ],
            "_id": "67edba8a7fd5ff1d45674e70"
          },
          {
            "credits": 4,
            "courses": [
              "MA 26100"
            ],
            "_id": "67edba8a7fd5ff1d45674e71"
          },
          {
            "credits": 4,
            "courses": [
              "MA 26500"
            ],
            "_id": "67edba8a7fd5ff1d45674e72"
          }
        ],
        "id": "67edba8a7fd5ff1d45674e6a"
      }
    ],
    "id": "67e98dfb82e147fe3bbdfc2c"
  }
]

const ds_major = [
  {
    "name": "Data Science",
    "requirements": [
      {
        "name": "Data Science Core",
        "subrequirements": [
          {
            "credits": 4,
            "courses": [
              "CS 18000"
            ],
            "_id": "67eddc216928c10142a5cd15"
          },
          {
            "credits": 3,
            "courses": [
              "CS 18200"
            ],
            "_id": "67eddc216928c10142a5cd16"
          },
          {
            "credits": 1,
            "courses": [
              "CS 38003"
            ],
            "_id": "67eddc216928c10142a5cd17"
          },
          {
            "credits": 3,
            "courses": [
              "STAT 35500"
            ],
            "_id": "67eddc216928c10142a5cd18"
          },
          {
            "credits": 3,
            "courses": [
              "CS 25100"
            ],
            "_id": "67eddc216928c10142a5cd19"
          },
          {
            "credits": 3,
            "courses": [
              "CS 25300"
            ],
            "_id": "67eddc216928c10142a5cd1a"
          },
          {
            "credits": 3,
            "courses": [
              "STAT 41600"
            ],
            "_id": "67eddc216928c10142a5cd1b"
          },
          {
            "credits": 3,
            "courses": [
              "CS 37300"
            ],
            "_id": "67eddc216928c10142a5cd1c"
          },
          {
            "credits": 3,
            "courses": [
              "STAT 41700"
            ],
            "_id": "67eddc216928c10142a5cd1d"
          },
          {
            "credits": 3,
            "courses": [
              "CS 44000"
            ],
            "_id": "67eddc216928c10142a5cd1e"
          }
        ],
        "id": "67eddc216928c10142a5cd14"
      }
    ],
    "id": "67e98e1582e147fe3bbdfc2f"
  }
]

const core_course_objects = [
  {
      "courseID": "67e8f93571a39e0a51dbf172",
      "name": "CS 18000",
      "semester": "",
      "semesterIndex": -1,
      "description": "Problem Solving And Object-Oriented Programming",
      "difficulty": 4.5,
      "creditHours": 4,
      "prerequisites": [],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f93571a39e0a51dbf174",
      "name": "CS 18200",
      "semester": "",
      "semesterIndex": -1,
      "description": "Foundations Of Computer Science",
      "difficulty": 0,
      "creditHours": 3,
      "prerequisites": [
          [
              "CS 18000"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f93671a39e0a51dbf182",
      "name": "CS 24000",
      "semester": "",
      "semesterIndex": -1,
      "description": "Programming In C",
      "difficulty": 0,
      "creditHours": 3,
      "prerequisites": [
          [
              "CS 18000"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f93671a39e0a51dbf186",
      "name": "CS 25000",
      "semester": "",
      "semesterIndex": -1,
      "description": "Computer Architecture",
      "difficulty": 0,
      "creditHours": 4,
      "prerequisites": [
          [
              "CS 18200"
          ],
          [
              "CS 24000"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f93671a39e0a51dbf188",
      "name": "CS 25100",
      "semester": "",
      "semesterIndex": -1,
      "description": "Data Structures And Algorithms",
      "difficulty": 0,
      "creditHours": 3,
      "prerequisites": [
          [
              "CS 18200"
          ],
          [
              "CS 24000",
              "CS 24200",
              "STAT 24200"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f93671a39e0a51dbf18a",
      "name": "CS 25200",
      "semester": "",
      "semesterIndex": -1,
      "description": "Systems Programming",
      "difficulty": 0,
      "creditHours": 4,
      "prerequisites": [
          [
              "CS 25100"
          ],
          [
              "CS 25000"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f97071a39e0a51dbfd04",
      "name": "MA 26100",
      "semester": "",
      "semesterIndex": -1,
      "description": "Multivariate Calculus",
      "difficulty": 0,
      "creditHours": 4,
      "prerequisites": [
          [
              "MA 16200",
              "MA 16600"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  },
  {
      "courseID": "67e8f97071a39e0a51dbfd0a",
      "name": "MA 26500",
      "semester": "",
      "semesterIndex": -1,
      "description": "Linear Algebra",
      "difficulty": 0,
      "creditHours": 3,
      "prerequisites": [
          [
              "MA 16200",
              "MA 16600"
          ]
      ],
      "corequisites": [],
      "conflicts": []
  }
]

describe('Testing course aggregation from major', () => {
  test("Sanity test", () => {
    expect(aggregateCoreRequirementsIntoArray(sanity_1_majors)).toEqual(['ONLY_COURSE']);
    let sanity_2_majors = [...sanity_1_majors];
    sanity_2_majors[0].requirements[0].subrequirements.push(
      {
        "credits": 3,
        "courses": [
          "REQUIRED_COURSE_2"
        ]
      }
    )
    expect(aggregateCoreRequirementsIntoArray(sanity_1_majors)).toEqual(['ONLY_COURSE', "REQUIRED_COURSE_2"]);
    expect(aggregateCoreRequirementsIntoArray([])).toEqual([]);
  })
  test("Testing CS Aggregation", () => {
    expect(aggregateCoreRequirementsIntoArray(cs_major)).toEqual([
      "CS 18000",
      "CS 18200",
      "CS 24000",
      "CS 25000",
      "CS 25100",
      "CS 25200",
      "MA 26100",
      "MA 26500"
    ]);
  })
  test("Testing DS Aggregation", () => {
    expect(aggregateCoreRequirementsIntoArray(ds_major)).toEqual([
      "CS 18000",
      "CS 18200",
      "CS 38003",
      "STAT 35500",
      "CS 25100",
      "CS 25300",
      "STAT 41600",
      "CS 37300",
      "STAT 41700",
      "CS 44000"
    ]);
  })
})